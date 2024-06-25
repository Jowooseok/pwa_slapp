mod evm_rpc;
mod user_storage;

use evm_rpc::{
    Block, BlockTag, EthMainnetService, EvmRpcCanister, GetBlockByNumberResult,
    MultiGetBlockByNumberResult, RpcServices,
};
use ic_cdk::api::management_canister::ecdsa::{
    ecdsa_public_key, sign_with_ecdsa, EcdsaCurve, EcdsaKeyId, EcdsaPublicKeyArgument,
    EcdsaPublicKeyResponse, SignWithEcdsaArgument, SignWithEcdsaResponse,
};
use ic_cdk::api::caller;
use ic_cdk_macros::{update, query};
use user_storage::{User, save_user, get_user_by_principal, delete_user_by_principal};

//etherium
#[update]
async fn get_latest_ethereum_block() -> Block {
    let rpc_providers = RpcServices::EthMainnet(Some(vec![EthMainnetService::Cloudflare]));

    let cycles = 10_000_000_000;
    let (result,) =
        EvmRpcCanister::eth_get_block_by_number(rpc_providers, None, BlockTag::Latest, cycles)
            .await
            .expect("Call failed");

    match result {
        MultiGetBlockByNumberResult::Consistent(r) => match r {
            GetBlockByNumberResult::Ok(block) => block,
            GetBlockByNumberResult::Err(err) => panic!("{err:?}"),
        },
        MultiGetBlockByNumberResult::Inconsistent(_) => {
            panic!("RPC providers gave inconsistent results")
        }
    }
}

#[update]
async fn get_ecdsa_public_key() -> EcdsaPublicKeyResponse {
    let (pub_key,) = ecdsa_public_key(EcdsaPublicKeyArgument {
        key_id: key_id(),
        ..Default::default()
    })
    .await
    .expect("Failed to get public key");
    pub_key
}

#[update]
async fn sign_hash_with_ecdsa(message_hash: Vec<u8>) -> SignWithEcdsaResponse {
    let (signature,) = sign_with_ecdsa(SignWithEcdsaArgument {
        message_hash,
        key_id: key_id(),
        ..Default::default()
    })
    .await
    .expect("Failed to sign");
    signature
}



// Users
// Register User with principal, eth_address, icp_address, register time
#[update]
async fn register_user(eth_address: String, icp_address: String) {
    let user_principal = caller();
    let user = User {
        user_principal,
        eth_address,
        icp_address,
        registered_at: ic_cdk::api::time() as i64,
    };
    save_user(user).await;
}

// Get user info
#[query]
async fn get_registered_user() -> Option<User> {
    let user_principal = caller();
    get_user_by_principal(user_principal).await
}

// Delete user info
#[update]
async fn delete_user() {
    let principal = caller();
    delete_user_by_principal(principal).await;
}

fn key_id() -> EcdsaKeyId {
    EcdsaKeyId {
        curve: EcdsaCurve::Secp256k1,
        name: "dfx_test_key".to_string(), // use EcdsaKeyId::default() for mainnet
    }
}
