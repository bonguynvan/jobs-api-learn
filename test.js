function isValid(s) {
    const stack = [];
    const openBrackets = ['(', '[', '{'];
    const closeBrackets = [')', ']', '}'];
    const bracketPairs = { ')': '(', ']': '[', '}': '{' };
  
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
  
      if (openBrackets.includes(char)) {
        // If the character is an opening bracket, push it onto the stack
        stack.push(char);
        console.log(stack)
    } else if (closeBrackets.includes(char)) {
        // If the character is a closing bracket, check if it matches the last opening bracket on the stack
        const lastOpenBracket = stack.pop();
        if (lastOpenBracket !== bracketPairs[char]) {
          // If the brackets don't match, the string is not valid
        console.log(stack)
          return false;
        }
      }
    }
  
    // If there are any opening brackets left on the stack, the string is not valid
    return stack.length === 0;
  }
console.log(isValid('([]){}'))