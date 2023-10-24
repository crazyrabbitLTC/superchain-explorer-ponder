import { Log, Block, Transaction, } from "@ponder/core"
import { Context, Block_entry as Block_entry_type, Log_entry as Log_entry_type, Transaction_entry as Transaction_entry_type, Address } from "@/generated"


interface Entity {
    create(data: object): Promise<void>;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

interface CreateCommonEntitiesReturnType {
    newBlock: Block_entry_type; // Replace 'any' with the actual type if known
    newTransaction: Transaction_entry_type; // Replace 'any' with the actual type if known
    newLog: Log_entry_type; // Replace 'any' with the actual type if known
    sender: Address;
    contract: Address;
}

async function createCommonEntities(event: { log: Log; block: Block; transaction: Transaction; }, context: Context): Promise<CreateCommonEntitiesReturnType> {
    const { Log_entry, Block_entry, Transaction_entry } = context.entities;

    const { sender, contract } = await recordSenderAndContract(event, context);

    let newBlock = await Block_entry.findUnique({ id: event.block.hash });
    // check if block already exists
    if (!newBlock) {
        newBlock = await Block_entry.create({
            id: event.block.hash,
            data: {
                baseFeePerGas: event.block.baseFeePerGas || undefined,
                extraData: event.block.extraData,
                gasLimit: event.block.gasLimit,
                gasUsed: event.block.gasUsed,
                hash: event.block.hash,
                logsBloom: event.block.logsBloom,
                miner: event.block.miner,
                number: event.block.number,
                parentHash: event.block.parentHash,
                receiptsRoot: event.block.receiptsRoot,
                size: event.block.size,
                stateRoot: event.block.stateRoot,
                timestamp: event.block.timestamp,
                totalDifficulty: event.block.totalDifficulty,
                transactionsRoot: event.block.transactionsRoot,
            },
        });
    }

    let newTransaction = await Transaction_entry.findUnique({ id: event.transaction.hash });
    if (!newTransaction) {
        newTransaction = await Transaction_entry.create({
            id: event.transaction.hash,
            data: {
                blockHash: event.transaction.blockHash,
                blockNumber: event.transaction.blockNumber,
                block: event.block.hash,
                // chainId: event.transaction.chainId, // figure out why the chainId is missing
                from: event.transaction.from,
                gas: event.transaction.gas,
                gasPrice: event.transaction.gasPrice,
                hash: event.transaction.hash,
                input: event.transaction.input,
                maxFeePerGas: event.transaction.maxFeePerGas,
                maxPriorityFeePerGas: event.transaction.maxPriorityFeePerGas,
                nonce: event.transaction.nonce,
                to: event.transaction.to || ZERO_ADDRESS,
                transactionIndex: event.transaction.transactionIndex,
                value: event.transaction.value,
            },
        });
    }

    let newLog = await Log_entry.findUnique({ id: event.log.id });
    if (!newLog) {
        newLog = await Log_entry.create({
            id: event.log.id,
            data: {
                address: event.log.address,
                blockHash: event.log.blockHash,
                blockNumber: event.log.blockNumber,
                data: event.log.data,
                logIndex: event.log.logIndex,
                removed: event.log.removed,
                topics: event.log.topics,
                transactionHash: event.log.transactionHash,
                transactionIndex: event.log.transactionIndex,
                transaction: newTransaction.id,
            },
        });
    }

    return { newBlock, newTransaction, newLog, sender, contract };
}

export async function findOrCreateAddress(id: string, context: Context, isContract = false) {
    const { Address } = context.entities;

    const account = await Address.findUnique({ id });

    if (account) {
        return account;
    }

    return await Address.create({
        id,
        data: {
            isContract: isContract,
        },
    });
}

export async function markAddressAsContract(address: Address, context: Context) {
    const { Address } = context.entities;

    await Address.update({
        id: address.id,
        data: {
            isContract: true,
        },
    });
}

export async function recordSenderAndContract(event: { log: Log; block: Block; transaction: Transaction; }, context: Context) {
    const { Address } = context.entities;

    // Mark address Contract
    const contract = await findOrCreateAddress(event.log.address, context);
    await markAddressAsContract(contract, context);

    // Create TX Sender
    const sender = await findOrCreateAddress(event.transaction.from, context);
    return { sender, contract };
}

export { createCommonEntities }