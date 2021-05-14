import os, sys
import subprocess
from time import sleep

repo_path = os.path.abspath(__file__)
addr_file = "pubkeys.txt"

with open(
    os.path.join(os.path.dirname(repo_path), "data", addr_file), "r", encoding="utf-16"
) as address:
    result = []
    lines = address.readlines()
    for line in lines:
        if line[0:6] == "pubkey":
            result.append(line[8:].replace("\n", ""))

from_wallet = sys.argv[1]
private_key_file = sys.argv[2]
token_usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
token_ray = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
recipient_addr_list = ""
sol_qty = 0.01
token_qty = 20
for pub_key in [recipient_addr_list]:
    subprocess.call(
        [
            "solana",
            "transfer",
            pub_key,
            sol_qty,
            "--allow-unfunded-recipient",
            "--url",
            "mainnet-beta",
            "--fee-payer",
            private_key_file,
        ]
    )
    subprocess.call(
        [
            "spl-token",
            "transfer",
            token_ray,
            token_qty,
            pub_key,
            "--fund-recipient",
            "--allow-unfunded-recipient",
            "--owner",
            private_key_file,
            "--url",
            "mainnet-beta",
        ]
    )
    sleep(1)
    # "--from",from_wallet,
