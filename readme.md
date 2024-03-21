#主文件： transfer_batch.js

transferFund（）循环打钱给对方地址

DisperseFunds(,prodFlag=true,send_from=0,receive_from=2)：从send_from 分配资金到后面receive_from，星形
generateSolanaKeypairs(mnemonic,3)(助记词生成系列私钥

钱包序列可以从generate_pk.js +输入助记词生成

give_to_7i.js是初始例子，就发送 私钥数组所对应的钱包数组的SOL给固定地址 (2024土狗打法）


# err handling

failed ({"err":{"InsufficientFundsForRent":{"account_index":1}}})

means init account needs more money 0.0003 will fail
0.001 OKAY