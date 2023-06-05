# list nodes

This is a simple utility for listing every node in the current document, starting from `document` and recursively branching to descendants. There are two flavors.

## [`simple.js`](./simple.js)

This just prints to the console an array of all of the nodes. Modern developer consoles allow you to right-click on the array and save it as a temporary global variable.

## [`live.js`](./live.js)

This asks you for a global variable name to use, suggesting one that is not in use. This variable becomes a ‘live’ array of nodes. The array does not update, but a new array is generated whenever that variable is accessed. Assigning to or deleting that global variable removes the ‘live’ functionality of the variable and causes no problems.
