import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kovagothlqageyjvsrzr.supabase.co";
const SUPABASE_KEY = "sb_publishable_qGpTLnslQmG2za3zgRcfGg_WwgBEFpp";
const CLOUD_NAME = "bogvstre";
const UPLOAD_PRESET = "MegaTrix General";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadToCloudinary(fileInput) {
  if (!fileInput || typeof fileInput !== "string") return null;
  if (fileInput.includes("res.cloudinary.com")) {
    console.log("  -> Already on Cloudinary:", fileInput.substring(0, 60) + "...");
    return fileInput;
  }

  console.log("  -> Uploading to Cloudinary preset [" + UPLOAD_PRESET + "]...");

  const formData = new FormData();
  formData.append("file", fileInput);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.secure_url) {
      console.log("  ✓ Successfully uploaded to Cloudinary:", data.secure_url);
      return data.secure_url;
    } else {
      console.error("  ✗ Cloudinary Error:", data);
      return null;
    }
  } catch (err) {
    console.error("  ✗ Network Error uploading to Cloudinary:", err);
    return null;
  }
}

async function runMigration() {
  console.log("=== STARTING CLOUDINARY IMAGE MIGRATION ===");
  console.log("Cloud Name:", CLOUD_NAME);
  console.log("Upload Preset:", UPLOAD_PRESET);

  const { data: projects, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Failed to fetch projects from Supabase:", error);
    process.exit(1);
  }

  console.log(`Found ${projects.length} project(s) in Supabase database.`);

  for (const project of projects) {
    console.log(`\n--- Processing Project: [${project.id}] "${project.title}" ---`);
    let modified = false;
    let newImageUrl = project.image_url;
    let newGallery = Array.isArray(project.gallery_images) ? [...project.gallery_images] : [];

    // Migrate Cover Image
    if (project.image_url) {
      console.log("Migrating primary image_url...");
      const uploaded = await uploadToCloudinary(project.image_url);
      if (uploaded && uploaded !== project.image_url) {
        newImageUrl = uploaded;
        modified = true;
      }
    }

    // Migrate Gallery Images
    if (newGallery.length > 0) {
      const updatedGallery = [];
      for (let i = 0; i < newGallery.length; i++) {
        console.log(`Migrating gallery_images[${i}]...`);
        const img = newGallery[i];
        const uploaded = await uploadToCloudinary(img);
        if (uploaded) {
          updatedGallery.push(uploaded);
          if (uploaded !== img) modified = true;
        } else {
          updatedGallery.push(img);
        }
      }
      newGallery = updatedGallery;
    }

    if (modified) {
      console.log(`Saving updated Cloudinary URLs for "${project.title}" to Supabase...`);
      let { error: updateError } = await supabase
        .from("projects")
        .update({
          image_url: newImageUrl,
          gallery_images: newGallery,
        })
        .eq("id", project.id);

      if (updateError && (updateError.message.includes("gallery_images") || updateError.code === "PGRST204")) {
        console.log("  -> Fallback update without gallery_images column...");
        const res = await supabase
          .from("projects")
          .update({
            image_url: newImageUrl,
          })
          .eq("id", project.id);
        updateError = res.error;
      }

      if (updateError) {
        console.error("Failed to update project in Supabase:", updateError);
      } else {
        console.log(`✓ Project "${project.title}" successfully updated with Cloudinary URL in Supabase.`);
      }
    } else {
      console.log(`No changes needed for "${project.title}".`);
    }
  }

  console.log("\n=== MIGRATION COMPLETE ===");
}

runMigration().catch(console.error);
