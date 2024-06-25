use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api;
use ic_cdk_macros::{update, query};
use sha2::{Sha256, Digest};

// Structure to store metadata about the uploaded files
#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct FileMetadata {
    pub file_id: String,        // Unique identifier for the file
    pub file_url: String,       // URL where the file is stored
    pub metadata: String,       // Additional metadata about the file
    pub file_hash: String,      // Hash value for file integrity verification
    pub created_at: u64,        // Timestamp when the file was created
    pub uploader: Principal,    // Principal of the user who uploaded the file
}

// Static storage for file metadata
static mut FILE_METADATA_STORAGE: Vec<FileMetadata> = Vec::new();

// Function to save file metadata
#[update]
pub async fn save_file_metadata(file_id: String, file_url: String, metadata: String) {
    // Hash the file URL
    let mut hasher = Sha256::new();
    hasher.update(file_url.as_bytes());
    let result = hasher.finalize();
    let file_hash = format!("{:x}", result);

    // Create a new FileMetadata entry
    let metadata_entry = FileMetadata {
        file_id,
        file_url,
        metadata,
        file_hash,
        created_at: api::time(),
        uploader: api::caller(),
    };

    // Unsafe block to push the metadata entry into storage
    unsafe {
        FILE_METADATA_STORAGE.push(metadata_entry);
    }
}

// Function to retrieve all stored file metadata
#[query]
pub fn get_all_files() -> Vec<FileMetadata> {
    unsafe { FILE_METADATA_STORAGE.clone() }
}

// Function to retrieve file metadata by file ID
#[query]
pub fn get_file_by_id(file_id: String) -> Option<FileMetadata> {
    unsafe {
        FILE_METADATA_STORAGE.iter().cloned().find(|file| file.file_id == file_id)
    }
}

// Function to verify if the given file URL matches the stored hash
#[query]
pub fn verify_file_url(file_id: String, file_url: String) -> bool {
    if let Some(file_metadata) = get_file_by_id(file_id.clone()) {
        // Hash the given file URL
        let mut hasher = Sha256::new();
        hasher.update(file_url.as_bytes());
        let result = hasher.finalize();
        let hash_str = format!("{:x}", result);
        
        // Compare the hashed URL with the stored file hash
        return hash_str == file_metadata.file_hash;
    }
    false
}
