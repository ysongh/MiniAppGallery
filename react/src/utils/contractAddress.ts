export const getContractAddress = (networkId: number): `0x${string}` => {
  if (networkId === 84532) return import.meta.env.VITE_BASESEPOLIA_ONTRACT_ADDRESS as `0x${string}`;
  else if (networkId === 8453) return import.meta.env.VITE_BASE_ONTRACT_ADDRESS as `0x${string}`;
  else if (networkId === 44787) return import.meta.env.VITE_CELOALFAJORES_CONTRACT_ADDRESS as `0x${string}`;
  return import.meta.env.VITE_LOCAL_CONTRACT_ADDRESS as `0x${string}`;;
}