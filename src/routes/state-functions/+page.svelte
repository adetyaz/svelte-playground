<script lang="ts">
	import { Counter } from "$lib/counter.svelte";



// uder the hood in classes, svelte creates getters and setters for you

  // class Counter{
  //   count: number;
    
  //   constructor(initial: number){
  //     this.count = $state(initial)
  //   }
  // }


  // function createCounter(initial: number){

    // deeply reactive state
    // let counter = $state({ count: initial })
    // return counter
    // let count = $state(initial)


    // using functions
    // return {
    //   count(){ return count},
    //   setCount(v: number){ count = v}
    // }

    // using getters and setters
    // return{
    //   get count(){
    //     return count
    //   },
    //   set count(v){
    //     count = v
    //   }
    // }
  // }

  //using as a reactive uitility
  // function reactive<T>(value: T){
  //   let state = $state<T>(value)
  //   return state
  // }


  // function createCounter(initial: number){
  //   let counter = reactive({ count: initial})
  //   return counter
  // }


  let counter = new Counter(0)
</script>


<main class="h-screen bg-black text-white flex flex-col justify-center items-center gap-8 p-8">
  <p>Snooze is {counter.count}</p>

  <button class="rounded bg-green-200 py-3 px-8 text-sm font-bold" onclick={() => counter.count++}>
    {counter.count}
  </button>
</main>