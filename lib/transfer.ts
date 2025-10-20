import { parseEther, formatEther, Address, encodeFunctionData, http, keccak256, toHex } from 'viem';
import { createBundlerClient } from 'viem/account-abstraction';
import { publicClient } from './clients';
import type { SmartAccount } from './smartAccount-deploy';

// TransferEventWrapper contract address
const TRANSFER_EVENT_WRAPPER_ADDRESS = '0xFf71Ff614d6B621541408Adce546bF68Ad399b5d' as Address;

// TransferEventWrapper ABI
const TRANSFER_EVENT_WRAPPER_ABI = [
  {
    name: 'emitNativeTransferEvent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'userOpHash', type: 'bytes32' }
    ],
    outputs: []
  },
  {
    name: 'emitERC20TransferEvent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'userOpHash', type: 'bytes32' }
    ],
    outputs: []
  },
  {
    name: 'emitBatchTransferEvent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipients', type: 'address[]' },
      { name: 'values', type: 'uint256[]' },
      { name: 'transferType', type: 'string' },
      { name: 'tokenAddress', type: 'address' },
      { name: 'userOpHash', type: 'bytes32' }
    ],
    outputs: []
  }
] as const;

// Get bundler URL with API key
function getBundlerUrl(): string {
  const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
  if (!apiKey || apiKey === 'your_pimlico_api_key_here') {
    throw new Error('Pimlico API key not configured. Please add NEXT_PUBLIC_PIMLICO_API_KEY to .env.local');
  }
  return `https://api.pimlico.io/v2/monad-testnet/rpc?apikey=${apiKey}`;
}

/**
 * ERC-20 Token ABI (minimal)
 */
export const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  // Events
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256' }
    ]
  }
] as const;

/**
 * Token info interface
 */
export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  balance: bigint;
}

/**
 * Transfer recipient
 */
export interface TransferRecipient {
  address: Address;
  amount: bigint;
}

/**
 * Get native MON balance
 */
export async function getNativeBalance(address: Address): Promise<bigint> {
  console.log('💰 Getting native balance for:', address);
  
  try {
    const balance = await publicClient.getBalance({ address });
    console.log('✅ Balance:', formatEther(balance), 'MON');
    return balance;
  } catch (error) {
    console.error('❌ Failed to get balance:', error);
    throw error;
  }
}

/**
 * Get ERC-20 token info
 */
export async function getTokenInfo(tokenAddress: Address, userAddress: Address): Promise<TokenInfo> {
  console.log('📋 Getting token info for:', tokenAddress);
  
  try {
    const [name, symbol, decimals, balance] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'name'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'symbol'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [userAddress]
      })
    ]);

    const tokenInfo: TokenInfo = {
      address: tokenAddress,
      name: name as string,
      symbol: symbol as string,
      decimals: decimals as number,
      balance: balance as bigint
    };

    console.log('✅ Token info:', tokenInfo);
    return tokenInfo;
  } catch (error) {
    console.error('❌ Failed to get token info:', error);
    throw error;
  }
}

/**
 * Transfer native MON using Smart Account via Bundler
 */
export async function transferNative(
  smartAccount: SmartAccount,
  to: Address,
  amount: bigint
): Promise<`0x${string}`> {
  console.log('💸 Transferring', formatEther(amount), 'MON to', to);
  console.log('Smart Account Address:', smartAccount.address);

  // ✅ Use Viem bundlerClient.sendUserOperation()
  if (smartAccount.implementation) {
    try {
      console.log('🚀 Using Viem bundlerClient.sendUserOperation()...');
      
      // Check Smart Account balance
      const balance = await smartAccount.client.getBalance({ 
        address: smartAccount.address 
      });
      console.log('💰 Smart Account balance:', formatEther(balance), 'MON');
      
      if (balance < amount + parseEther('0.001')) {
        throw new Error(
          `Insufficient balance. Current: ${formatEther(balance)} MON. ` +
          `Need: ${formatEther(amount + parseEther('0.001'))} MON (transfer + gas).`
        );
      }
      
      // Create bundler client
      const bundlerUrl = getBundlerUrl();
      const bundlerClient = createBundlerClient({
        client: publicClient,
        transport: http(bundlerUrl),
      });
      
      // Get gas prices
      const gasPrice = await smartAccount.client.getGasPrice();
      const maxFeePerGas = (gasPrice * 150n) / 100n; // 150% buffer
      const maxPriorityFeePerGas = parseEther('0.000001');
      
      console.log('⛽ Gas prices:', {
        maxFee: formatEther(maxFeePerGas),
        maxPriority: formatEther(maxPriorityFeePerGas)
      });
      
      console.log('📋 Sending UserOp via bundlerClient...');
      
      // Prepare event emission call
      const eventCallData = encodeFunctionData({
        abi: TRANSFER_EVENT_WRAPPER_ABI,
        functionName: 'emitNativeTransferEvent',
        args: [to, amount, '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`]
      });
      
      // Send user operation with transfer + event emission
      const userOperationHash = await bundlerClient.sendUserOperation({
        account: smartAccount.implementation,
        calls: [
          {
            to: to,
            value: amount,
            data: '0x' as `0x${string}`, // Empty data for native transfer
          },
          {
            to: TRANSFER_EVENT_WRAPPER_ADDRESS,
            value: 0n,
            data: eventCallData, // Emit event
          },
        ],
        maxFeePerGas,
        maxPriorityFeePerGas,
      });
      
      console.log('✅ UserOperation hash:', userOperationHash);
      
      // Wait for receipt
      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOperationHash,
      });
      
      console.log('✅ UserOperation receipt:', receipt);
      console.log('📡 Event emitted to Envio indexer');
      return receipt.receipt.transactionHash;
      
    } catch (error) {
      console.error('❌ Viem bundlerClient failed:', error);
      throw error;
    }
  }

  throw new Error('Smart Account implementation not available');
}

/**
 * Transfer ERC-20 token using Smart Account via Bundler
 */
export async function transferERC20(
  smartAccount: SmartAccount,
  tokenAddress: Address,
  to: Address,
  amount: bigint
): Promise<`0x${string}`> {
  console.log('💸 Transferring ERC-20 token');
  console.log('Token:', tokenAddress);
  console.log('To:', to);
  console.log('Amount:', amount.toString());

  // ✅ Use Viem bundlerClient.sendUserOperation()
  if (smartAccount.implementation) {
    try {
      console.log('🚀 Using Viem bundlerClient.sendUserOperation() for ERC-20...');
      
      // Check token balance
      const balance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [smartAccount.address]
      }) as bigint;
      
      console.log('💰 Token balance:', balance.toString());
      
      if (balance < amount) {
        throw new Error(`Insufficient token balance. Current: ${balance.toString()}, Need: ${amount.toString()}`);
      }
      
      // Create bundler client
      const bundlerUrl = getBundlerUrl();
      const bundlerClient = createBundlerClient({
        client: publicClient,
        transport: http(bundlerUrl),
      });
      
      // Get gas prices
      const gasPrice = await smartAccount.client.getGasPrice();
      const maxFeePerGas = (gasPrice * 150n) / 100n;
      const maxPriorityFeePerGas = parseEther('0.000001');
      
      // Encode ERC-20 transfer call
      const transferCallData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to, amount]
      });
      
      // Prepare event emission call
      const eventCallData = encodeFunctionData({
        abi: TRANSFER_EVENT_WRAPPER_ABI,
        functionName: 'emitERC20TransferEvent',
        args: [tokenAddress, to, amount, '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`]
      });
      
      console.log('📋 Sending ERC-20 transfer UserOp...');
      
      // Send user operation with transfer + event emission
      const userOperationHash = await bundlerClient.sendUserOperation({
        account: smartAccount.implementation,
        calls: [
          {
            to: tokenAddress,
            value: 0n,
            data: transferCallData,
          },
          {
            to: TRANSFER_EVENT_WRAPPER_ADDRESS,
            value: 0n,
            data: eventCallData, // Emit event
          },
        ],
        maxFeePerGas,
        maxPriorityFeePerGas,
      });
      
      console.log('✅ UserOperation hash:', userOperationHash);
      
      // Wait for receipt
      const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOperationHash,
      });
      
      console.log('✅ UserOperation receipt:', receipt);
      console.log('📡 Event emitted to Envio indexer');
      return receipt.receipt.transactionHash;
      
    } catch (error) {
      console.error('❌ ERC-20 transfer failed:', error);
      throw error;
    }
  }

  throw new Error('Smart Account implementation not available');
}

/**
 * Batch transfer - Send to multiple recipients in one transaction
 */
export async function batchTransfer(
  smartAccount: SmartAccount,
  recipients: TransferRecipient[],
  isNative: boolean = true,
  tokenAddress?: Address
): Promise<`0x${string}`> {
  console.log('📦 Batch transferring to', recipients.length, 'recipients');
  console.log('Type:', isNative ? 'Native MON' : `ERC-20 (${tokenAddress})`);

  if (!smartAccount.implementation) {
    throw new Error('Smart Account implementation not available');
  }

  try {
    // Calculate total amount
    const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0n);
    console.log('💰 Total amount:', isNative ? formatEther(totalAmount) : totalAmount.toString());

    // Check balance
    if (isNative) {
      const balance = await smartAccount.client.getBalance({ 
        address: smartAccount.address 
      });
      if (balance < totalAmount + parseEther('0.01')) {
        throw new Error(`Insufficient balance for batch transfer. Need: ${formatEther(totalAmount + parseEther('0.01'))} MON`);
      }
    } else if (tokenAddress) {
      const balance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [smartAccount.address]
      }) as bigint;
      
      if (balance < totalAmount) {
        throw new Error(`Insufficient token balance. Need: ${totalAmount.toString()}`);
      }
    }

    // Create bundler client
    const bundlerUrl = getBundlerUrl();
    const bundlerClient = createBundlerClient({
      client: publicClient,
      transport: http(bundlerUrl),
    });
    
    // Get gas prices
    const gasPrice = await smartAccount.client.getGasPrice();
    const maxFeePerGas = (gasPrice * 150n) / 100n;
    const maxPriorityFeePerGas = parseEther('0.000001');
    
    // Build calls array
    const calls = recipients.map(recipient => {
      if (isNative) {
        // Native transfer
        return {
          to: recipient.address,
          value: recipient.amount,
          data: '0x' as `0x${string}`,
        };
      } else {
        // ERC-20 transfer
        const transferData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [recipient.address, recipient.amount]
        });
        
        return {
          to: tokenAddress!,
          value: 0n,
          data: transferData,
        };
      }
    });
    
    console.log('📋 Sending batch UserOp with', calls.length, 'calls...');
    
    // Prepare batch event emission call
    const recipientAddresses = recipients.map(r => r.address);
    const recipientAmounts = recipients.map(r => r.amount);
    const eventCallData = encodeFunctionData({
      abi: TRANSFER_EVENT_WRAPPER_ABI,
      functionName: 'emitBatchTransferEvent',
      args: [
        recipientAddresses,
        recipientAmounts,
        isNative ? 'native' : 'erc20',
        isNative ? '0x0000000000000000000000000000000000000000' as Address : tokenAddress!,
        '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`
      ]
    });
    
    // Add event emission call to the batch
    const allCalls = [
      ...calls,
      {
        to: TRANSFER_EVENT_WRAPPER_ADDRESS,
        value: 0n,
        data: eventCallData, // Emit batch event
      }
    ];
    
    // Send batch user operation
    const userOperationHash = await bundlerClient.sendUserOperation({
      account: smartAccount.implementation,
      calls: allCalls,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
    
    console.log('✅ Batch UserOperation hash:', userOperationHash);
    
    // Wait for receipt
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOperationHash,
    });
    
    console.log('✅ Batch transfer completed:', receipt.receipt.transactionHash);
    console.log('📡 Batch event emitted to Envio indexer');
    return receipt.receipt.transactionHash;
    
  } catch (error) {
    console.error('❌ Batch transfer failed:', error);
    throw error;
  }
}

/**
 * Format amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  return `${integerPart}.${fractionalStr}`.replace(/\.?0+$/, '');
}

/**
 * Parse amount with decimals
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [integer = '0', fraction = '0'] = amount.split('.');
  const fractionalPadded = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer) * (10n ** BigInt(decimals)) + BigInt(fractionalPadded);
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

