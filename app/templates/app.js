//replace this with something useful
<% if(!es6) { %>
window.addTwoNumbers = function(a, b) {
    return a + b;
};
<% } else { %>
let addTwoNumbers = (a, b) => a + b;
export default addTwoNumbers;
<% } %>
