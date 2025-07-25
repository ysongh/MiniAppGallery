export const getContractAddress = (networkId: number): `0x${string}` => {
  if (networkId === 84532) return import.meta.env.VITE_BASESEPOLIA_ONTRACT_ADDRESS as `0x${string}`;
  return import.meta.env.VITE_LOCAL_CONTRACT_ADDRESS as `0x${string}`;;
}