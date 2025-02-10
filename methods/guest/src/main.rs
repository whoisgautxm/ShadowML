use risc0_zkvm::guest::env;
use risc0_zkvm::serde::from_slice;


pub fn main() {
    // TODO: Implement your guest code here
    let data:Vec<u32> = env::read();
    let (sepal_length, sepal_width, petal_length, petal_width): (u32, u32, u32, u32) = 
        from_slice(&data).unwrap();
    
    println!("sepal_length: {}, sepal_width: {}, petal_length: {}, petal_width: {}", sepal_length, sepal_width, petal_length, petal_width);

    let prediction: u32 = predict(sepal_length, sepal_width, petal_length, petal_width);


    env::commit(&prediction);
}

fn predict(sepal_length: u32, sepal_width: u32, petal_length: u32, petal_width :u32) -> u32 {
    if petal_width <= 80 {
        return 0
     }
    else {
        if petal_width <= 175 {
            if petal_length <= 495 {
                if petal_width <= 165 {
                    return 1
                 }
                else {
                    return 2
                 }
             }
            else {
                if petal_width <= 155 {
                    return 2
                 }
                else {
                    if sepal_length <= 695 {
                        return 1
                     }
                    else {
                        return 2
                     }
                 }
             }
         }
        else{ 
            if petal_length <= 485 {
                if sepal_length <= 595 {
                    return 1
                 }
                else {
                    return 2
                 }
             }
            else {
                return 2
             }
         }
     }
}