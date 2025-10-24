export class Counter{
  count: number

  constructor(initial: number){
    this.count = $state(initial)
  }
}