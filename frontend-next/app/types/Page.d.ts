export interface Page<ItemValueType> {
  totalItemCount: number;
  itemCount: number;
  items: { [key: string]: ItemValueType };
}