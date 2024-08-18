# tt-game-duel

Реализуйте игру "Дуэль"

— Есть прямоугольное поле Canvas, на прямоугольном поле расположены фигуры — два круга. Круги представляют собой героев, которые сражаются друг с другом. 
— Герои двигаются по прямой вверх и вниз на противоположных сторонах экрана (как биты в арканоиде). По достижении края поля герой отталкивается и меняет направление движения. 
— Герои пользуются заклинаниями — стреляют друг в друга шариками поменьше. 
— Если герой встречает на своем пути курсор мыши, то он отталкивается от него как от границы поля
— При соприкосновении с врагом, заклинание исчезает, а на табло засчитывается одно попадание. 
— Поле прямоугольное, выйти за границы нельзя
— Если на героя кликнуть, то появляется менюшка, выполненная с помощью React, с помощью которой можно поменять цвет заклинаний, которые он кидает

Для каждого героя есть два ползунка, которые настраивают частоту его стрельбы и скорость передвижения.

Реализация должна быть выполнена на чистом канвасе и реакте, без использования сторонних графических или игровых библиотек.


---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
