import { bn128_g1m_toMontgomery, bn128_g2m_toMontgomery, bn128_g1m_neg, bn128_ftm_one, bn128_pairingEq4, bn128_g1m_timesScalar, bn128_g1m_add, bn128_g1m_affine, bn128_g1m_neg} from "./websnark_bn128";
//import { bn128_g1m_toMontgomery } from "./websnark_bn128";

@external("env", "debug_printMemHex")
export declare function debug_mem(pos: i32, len: i32): void;

@external("env", "eth2_blockDataSize")
export declare function eth2_blockDataSize(): i32;

@external("env", "eth2_blockDataCopy")
export declare function eth2_blockDataCopy(outputOffset: i32, srcOffset: i32, length: i32): void;

@external("env", "eth2_loadPreStateRoot")
export declare function eth2_loadPreStateRoot(offset: i32): void;

@external("env", "eth2_savePostStateRoot")
export declare function eth2_savePostStateRoot(offset: i32): void;

/***
* load test vector
* TODO: document where the test vector comes from
*
* all input coordinates (G1 points and G2 points) are in normal form
* websnark expects inputs to be in montgomery form. To convert them,
* use g1m_toMontgomery and g2m_toMontgomery
*/

export function main(): i32 {
  let input_data_len = eth2_blockDataSize();
  let input_data_buff = new ArrayBuffer(input_data_len);
  eth2_blockDataCopy(input_data_buff as usize, 0, input_data_len);

  const SIZE_F = 32;

  let pFq12One = new ArrayBuffer(SIZE_F*12);
  // let pp = Uint8Array.wrap(pFq12One, 0, SIZE_F * 12);
  bn128_ftm_one(pFq12One as usize);

  //let pr = bn128.pr;

  // vk_a offset at 0
  //let vk_a1 = Uint8Array.wrap(input_data_buff, 0, 96);
  let pAlfa1 = ( input_data_buff as usize ); // vk_a1.buffer as usize;

  // vk_b2 offset at 96
  // let vk_b2 = Uint8Array.wrap(input_data_buff, 96, 192);
  // let pBeta2 = vk_b2.buffer as usize;
  let pBeta2 = ( input_data_buff as usize ) + 96;

  // vk_c2 offset at 96 + 192
  // let vk_g2 = Uint8Array.wrap(input_data_buff, 288, 192);
  // let pGamma2 = vk_g2.buffer as usize;
  let pGamma2 = (input_data_buff as usize) + 288;

  // let vk_d2 = Uint8Array.wrap(input_data_buff, 480, 192);
  // let pDelta2 = vk_d2.buffer as usize;

  let pDelta2 = ( input_data_buff as usize ) + 480; 

  // let proof_a1 = Uint8Array.wrap(input_data_buff, 672, 96);
  // let pA = proof_a1.buffer as usize;

  let pA = ( input_data_buff as usize ) + 672;


  // let proof_b2 = Uint8Array.wrap(input_data_buff, 768, 192);
  // let pB = proof_b2.buffer as usize;

  let pB = ( input_data_buff as usize ) + 768;

  // let proof_c1 = Uint8Array.wrap(input_data_buff, 960, 96);
  // let pC = proof_c1.buffer as usize;

  let pC = ( input_data_buff as usize ) + 960;

  /*
  debug_mem(pA as usize, 96);
  debug_mem(pB as usize, 192);
  debug_mem(pC as usize, 96);
  debug_mem(pAlfa1 as usize, 96);
  debug_mem(pBeta2 as usize, 192);
  debug_mem(pGamma2 as usize, 192);
  debug_mem(pDelta2 as usize, 192);
  */

  bn128_g1m_toMontgomery(pAlfa1, pAlfa1);
  bn128_g2m_toMontgomery(pBeta2, pBeta2);
  bn128_g2m_toMontgomery(pDelta2, pDelta2);
  bn128_g2m_toMontgomery(pGamma2, pGamma2);

  bn128_g1m_toMontgomery(pA, pA);
  bn128_g2m_toMontgomery(pB, pB);
  bn128_g1m_toMontgomery(pC, pC);

  /*
  debug_mem(pA as usize, 96);
  debug_mem(pB as usize, 192);
  debug_mem(pC as usize, 96);
  debug_mem(pAlfa1 as usize, 96);
  debug_mem(pBeta2 as usize, 192);
  debug_mem(pGamma2 as usize, 192);
  debug_mem(pDelta2 as usize, 192);
  */

  // let ic_count = input_data_buff[1056 as usize];
  // let ic_start = 1064;

  let num_ic = Uint8Array.wrap(input_data_buff, 1056, 8)[0] as usize;
  // let input_constraints = Uint8Array.wrap(input_data_buff, 1064, num_ic * SIZE_F * 3);
  let ic_start = ( input_data_buff as usize ) + 1064;

  //let input_count = input_data_buff[ic_start + ic_count * SIZE_F * 3];
  //let input_start = ic_start + ic_count * SIZE_F * 3 + 8;
  let num_input = Uint8Array.wrap(input_data_buff, 1064 + num_ic * SIZE_F * 3, 8)[0] as usize;
  // let public_input = Uint8Array.wrap(input_data_buff, 1064 + num_ic * SIZE_F * 3 + 8, num_input);
  let input_start = ( input_data_buff as usize ) + 1064 + num_ic * SIZE_F * 3 + 8;

  // TODO assert input count == input constraint count

  // pIC <== IC[0]

  // input are SIZE_F
  //input constraints are SIZE_F * 3

  //let pIC = (input_data_buff as usize) + ic_start;
  let pIC = ic_start;
  bn128_g1m_toMontgomery(pIC, pIC);
  debug_mem(pIC, 192);

  for (let i = 0 as usize; i < num_input; i++ ) {
    // ICAux <== IC[i+1]
    let pICAux = pIC + ((i + 1) * SIZE_F * 3);

    // ICAux <== g1m_toMontgomery(ICAux)
    bn128_g1m_toMontgomery(pICAux, pICAux);

    // ICr <== input[i]
    let pICr = input_start + (i * SIZE_F);

    /* TODO add this back in after asc compiler bug is fixed
    if (int_gte(pICr, pr)) {
      return 1;
    }
    */

    //debug_mem(pICAux, SIZE_F * 3);
    bn128_g1m_timesScalar(pICAux, pICr, SIZE_F, pICAux);
    bn128_g1m_add(pICAux, pIC, pIC);
    debug_mem(pIC, 192);
  }
  
  //debug_mem(pIC, SIZE_F * 3);

  //let pVKA = vk_a1.buffer as usize;

  bn128_g1m_affine(pIC, pIC);
  bn128_g1m_neg(pIC, pIC);
  bn128_g1m_neg(pA, pA);

  //debug_mem(pA as usize, 96);

  /*
  debug_mem(pB as usize, 192);
  debug_mem(pIC, SIZE_F * 3);
  debug_mem(pGamma2, SIZE_F * 3);
  */

  if (!bn128_pairingEq4(pA, pB, pIC, pGamma2, pC, pDelta2, pAlfa1, pBeta2, pFq12One as usize)) {
    debug_mem(pFq12One as usize, SIZE_F * 3);
  }

  let return_buf = new Array<u32>(2);
  eth2_savePostStateRoot(return_buf.buffer as usize);

  return 1;
}
