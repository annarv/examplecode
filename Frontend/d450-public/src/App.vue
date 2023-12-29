<template>
    <RouterView name="AppBar"></RouterView>
    <VContainer fluid class="wrapper">
      <div class="d-flex align-start">
        <RouterView name="LeftSide"></RouterView>
        <div class="w-100">
          <RouterView name="default"></RouterView>
        </div>
      </div>
    </VContainer>
    <VContainer fluid class="footer-fix">
      <footer>© 2010 - {{ new Date().getFullYear() }}</footer>
    </VContainer>
</template>
