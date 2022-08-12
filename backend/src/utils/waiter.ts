export async function waiter(milliseconds: number): Promise<void> {
  await setTimeout(() => {}, milliseconds);
}
