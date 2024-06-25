use candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::update;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct User {
    pub user_principal: Principal,
    pub eth_address: String,
    pub icp_address: String,
    pub registered_at: i64,
}

static mut USERS: Vec<User> = Vec::new();

#[update]
pub async fn save_user(user: User) {
    unsafe {
        USERS.push(user);
    }
}

pub async fn get_user_by_principal(user_principal: Principal) -> Option<User> {
    unsafe {
        USERS.iter().cloned().find(|user| user.user_principal == user_principal)
    }
}

#[update]
pub async fn delete_user_by_principal(user_principal: Principal) {
    unsafe {
        USERS.retain(|user| user.user_principal != user_principal);
    }
}
