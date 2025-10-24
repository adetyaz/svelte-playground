<script>
  let count = $state(0);
  let condition = $state(true);

  let intervaLCount = $state(0)
  let delay = $state(1000)

  // $effect(() => {
  //   const interval = setInterval(() => intervaLCount++, delay)

  //   return () => clearInterval(interval)
  // })

  $effect(() => {
    if (condition) {
      count = 0;
       console.log(`Count changed to: ${count}`);
    }
   
  })

</script>

<div style="display:flex; gap:16px; align-items:end">
  <div>
    Count: {count}
    <br />
    <button style = "background-color: blue; color: white; padding: 8px"  onclick={() => count += 1}>Increment</button>
  </div>

  <div>
    <button style = "background-color: blue; color: white; padding: 8px"  onclick={() => condition = !condition}>Toggle Condition</button>
  </div>
</div>

<div style="display: block;">
  <button style="background: grey; color: white; padding: 6;" onclick={() => delay*=2}>Slower</button>
  <button style="background: grey; color: white; padding: 6;" onclick={() => delay/=2}>Faster</button>
  {intervaLCount}
</div>