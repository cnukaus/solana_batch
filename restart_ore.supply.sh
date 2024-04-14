#Auhtor https://twitter.com/Pow2wer/status/1775372175291429330
#!/bin/bash

# The command you want to run
# 注意：最好指定id.json的绝对路径
CMD="ore --rpc https://api.mainnet-beta.solana.com --keypair /home/username/.config/solana/id.json --priority-fee 1 mine --threads 4"

# Infinite loop to keep running the command
while true; do
    echo "Starting the miner"
    # Execute the command
    $CMD
    
    # If the command fails (exits with a non-zero exit status), you can handle it here
    if [ $? -ne 0 ]; then
        echo "The command failed with an error. Restarting..."
    else
        echo "The command completed successfully. Restarting..."
    fi
    
    # Optional: add a delay before restarting the command, if needed
    sleep 1
done
