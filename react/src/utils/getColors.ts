export const getBGColor = (networkId: number): string =>  {
  console.log(networkId)
  if (networkId === 8453) return "bg-blue-500";
  else if (networkId === 42220) return "bg-yellow-500";
  return "bg-purple-500";
}