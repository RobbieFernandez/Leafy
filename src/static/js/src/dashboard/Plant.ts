export default interface Plant {
  name: string;
  id: number;
  lastWatered: number | null // epoch time
  warningThreshold: number,
  dangerThreshold: number,
}