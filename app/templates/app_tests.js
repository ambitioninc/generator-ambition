//replace this with something useful
<% if (es6) { %>import addTwoNumbers from '../app';<% } else { %>var addTwoNumbers = window.addTwoNumbers;<% } %>
describe('app', function() {
    it('should add two numbers', function() {
        expect(addTwoNumbers(2,3)).toBe(5);
    });
});
