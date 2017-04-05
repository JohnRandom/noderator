module.exports = {
  "extends": "standard",
  "plugins": [
    "standard",
    "promise",
    "react"
  ],
  "env": {
    "mocha": true,
    "node": true
  },
  "rules": {
    "space-before-function-paren": 0,
    "react/jsx-uses-vars": 2,
    "react/jsx-uses-react": 2,
    "react/react-in-jsx-scope": 2
  },
  "settings": {
    "import/parser": "babel-eslint",
    "import/resolve": {
      "moduleDirectory": ["node_modules", "src"]
    },
    "ecmaFeatures": {
      "classes": true,
      "jsx": true
    },
  },
  "parser": "babel-eslint"
};
