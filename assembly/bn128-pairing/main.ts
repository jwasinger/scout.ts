import { bn128_g1m_toMontgomery, bn128_g2m_toMontgomery, bn128_g1m_neg, bn128_ftm_one, bn128_pairingEq4, bn128_g1m_timesScalar, bn128_g1m_add, bn128_g1m_affine, bn128_g1m_neg, int_gte} from "./websnark_bn128";
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

  //let pr = bn128.pr;

  // vk_a offset at 0
  let vk_a1 = Uint8Array.wrap(input_data_buff, 0, 96);

  // vk_b2 offset at 96
  let vk_b2 = Uint8Array.wrap(input_data_buff, 96, 192);

  // vk_c2 offset at 96 + 192
  let vk_g2 = Uint8Array.wrap(input_data_buff, 288, 192);

  let vk_d2 = Uint8Array.wrap(input_data_buff, 480, 192);

  let proof_a1 = Uint8Array.wrap(input_data_buff, 672, 96);

  let proof_b2 = Uint8Array.wrap(input_data_buff, 768, 192);

  let proof_c1 = Uint8Array.wrap(input_data_buff, 960, 96);

  let ic_count = input_data_buff[1056] as usize;
  let ic_start = 1064;

  let input_count = input_data_buff[ic_start + ic_count * SIZE_F * 3] as usize;
  let input_start = ic_start + ic_count * SIZE_F * 3 + 8;

  // TODO assert input count == input constraint count

  // pIC <== IC[0]

  // input are SIZE_F
  //input constraints are SIZE_F * 3

  let pIC = (input_data_buff as usize) + ic_start;

  for (let i = 0 as usize; i < input_count; i++ ) {
    // ICAux <== IC[i+1]
    let pICAux = pIC + ((i + 1) * SIZE_F * 3);

    // ICAux <== g1m_toMontgomery(ICAux)
    bn128_g1m_toMontgomery(pICAux);

    // ICr <== input[i]
    let pICr = (input_count as usize) + (input_start + i) * SIZE_F;

    if (int_gte(pICr, pr)) {
      return 1;
    }

    bn128_g1m_timesScalar(pICAux, pICr, SIZE_F, pICAux);
    bn128_g1m_add(pICAux, pIC, pIC);
  }

  bn128_g1m_affine(pIC, pIC);
  bn128_g1m_neg(pC, pC);
  bn128_g1m_neg(pAlfa1, pAlfa1);
  if (bn128_pairingEq4(pA, pB, pIC, pGamma2, pC, pDelta2, pAlfa1, pBeta2, pFq12One as usize)) {
      return 0;
  } else {
      return 1;
  }

  let return_buf = new Array<u32>(2);
  eth2_savePostStateRoot(return_buf.buffer as usize);

  return 1;
}
