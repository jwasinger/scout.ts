
function signatureToG2(pSig: usize, pOut: usize) {

}

function pubKeyToG1(pPK: usize, pOut: usize) {

}

function hashToG2(pDigest: usize, pOut: usize) {

}

function FastAggregateVerify(/*list of public keys, ...*/): i32 {
    /*
    let aggregatedPk = ...
    coreVerify(aggregatedPk, ...)
    */
}

function CoreVerify(pPK: usize, pSig: usize, pMessage: usize): i32 {
    let pSigPoint = allocG2Point(...);
    if (!signatureToG2(pInputSig, pSigPoint)) {
        trap
    }

    let pMessagePoint = allocG2Point(...);
    if (!hashToG2(pMessage, pMessagePoint)) {
        trap
    }

    /*
        TODO pairing
    */
}

/*
Algo to check whether a list of message points are unique:

XOR all their bits together then binary search them to try and find a duplicate
/*

AggregateVerify input
---------------------

* list of public keys
* message that was signed
* aggregated signature

*/
export function main(): i32 {
/*
    CoreAggregateVerify py_ecc
    ----------------------

    signature_point = signature_to_G2(signature)
    accumulator = FQ12.one()
    // TODO: should check that the messages are unique?
    for pk, message in pairs:
        pubkey_point = pubkey_to_G1(pk)
        message_point = hash_to_G2(message, DST)
        accumulator *= pairing(message_point, pubkey_point, final_exponentiate=False)
    accumulator *= pairing(signature_point, neg(G1), final_exponentiate=False)
    return final_exponentiate(accumulator) == FQ12.one()
*/
}
