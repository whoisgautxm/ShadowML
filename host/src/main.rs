// These constants represent the RISC-V ELF and the image ID generated by risc0-build.
// The ELF is used for proving and the ID is used for verification.
use axum::{routing::get, routing::post, Json, Router};
use methods::{ZK_DTP_ELF, ZK_DTP_ID};
use risc0_zkvm::{default_prover, ExecutorEnv, Receipt};
use serde::{Deserialize, Serialize};
use std::fs;
use tower_http::cors::{CorsLayer, AllowOrigin, AllowMethods};

#[derive(Serialize, Deserialize)]
pub struct ProofOutput {
    pub proof: String,
    pub pub_inputs: String,
    pub image_id: String,
}

#[derive(Deserialize)]
struct IrisInput {
    sepal_length: u32,
    sepal_width: u32,
    petal_length: u32,
    petal_width: u32,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/generate-proof", post(generate_proof))
        .route("/getProof", get(get_proof))
        .route("/verify-proof", post(verify_proof))
        .layer(
            CorsLayer::new()
                .allow_origin(AllowOrigin::any())
                .allow_methods(AllowMethods::any())
                .allow_headers([hyper::header::CONTENT_TYPE])
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn generate_proof(Json(input): Json<IrisInput>) -> Json<String> {
    let data: (u32, u32, u32, u32) = (
        input.sepal_length,
        input.sepal_width,
        input.petal_length,
        input.petal_width,
    );

    let env = ExecutorEnv::builder()
        .write(&data)
        .unwrap()
        .build()
        .unwrap();

    let prover = default_prover();
    let receipt: Receipt = prover.prove(env, &ZK_DTP_ELF).unwrap().receipt;

    let mut bin_receipt = Vec::new();
    ciborium::into_writer(&receipt, &mut bin_receipt).unwrap();
    let proof = hex::encode(&bin_receipt);

    let receipt_journal_bytes_array = &receipt.journal.bytes.as_slice();
    let pub_inputs = hex::encode(&receipt_journal_bytes_array);

    let image_id_hex = hex::encode(
        ZK_DTP_ID
            .into_iter()
            .flat_map(|v| v.to_le_bytes().into_iter())
            .collect::<Vec<_>>(),
    );

    let proof_output = ProofOutput {
        proof: "0x".to_owned() + &proof,
        pub_inputs: "0x".to_owned() + &pub_inputs,
        image_id: "0x".to_owned() + &image_id_hex,
    };

    let proof_output_json = serde_json::to_string(&proof_output).unwrap();
    fs::write("/zk_dtp/zkVerify/app/src/proof.json", proof_output_json).unwrap();

    let output: u32 = receipt.journal.decode().unwrap();
    let dic = ["setosa", "versicolor", "virginica"];
    Json(format!(
        "This is the {} flower, and I can prove it!",
        dic[output as usize]
    ))
}

async fn get_proof() -> Json<ProofOutput> {
    let proof_file = fs::read_to_string("/zk_dtp/zkVerify/app/src/proof.json").unwrap();
    let proof_output: ProofOutput = serde_json::from_str(&proof_file).unwrap();
    Json(proof_output)
}

async fn verify_proof() -> Result<Json<String>, axum::http::StatusCode> {
    println!("Executing Node.js script for proof verification...");
    
    let output = std::process::Command::new("sh")
        .arg("-c")
        .arg("cd zk_dtp/zkVerify/app/src && node app.js")
        .output()
        .map_err(|e| {
            let error_msg = format!("Command execution error: {:?}", e);
            println!("{}", error_msg);
            axum::http::StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    
    println!("Node.js script stdout: {}", stdout);
    println!("Node.js script stderr: {}", stderr);

    if output.status.success() {
        let result = stdout.to_lowercase();
        println!("Script execution successful, checking result...");
        
        if result.contains("attestation confirmed") {
            println!("Attestation confirmed!");
            Ok(Json(r#"{"status": "success", "message": "Proof verified and attestation confirmed!"}"#.to_string()))
        } else {
            println!("Verification still in progress");
            Ok(Json(r#"{"status": "pending", "message": "Verification in progress"}"#.to_string()))
        }
    } else {
        println!("Script execution failed");
        Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
    }
}

