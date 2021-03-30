/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import ThemeProvider from './src/ui/providers/ThemeProvider';
 import Home from './src/ui/views/Home';
 
 const App = () => {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider> 
  )
 };
 
 
 export default App;
 