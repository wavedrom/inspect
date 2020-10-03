'use strict';

const reVar = React => {
  const $ = React.createElement;
  return function Var (props) {
    return $('div', {}, props.type, props.size, props.name);
  };
};

module.exports = React => {
  const $ = React.createElement;
  const Var = reVar(React);
  return function El (props) {
    return $('div',
      {
        'data-depth': props.depth,
        style: {
          position: 'absolute',
          left: 0,
          // top: 18 * props.depth,
          height: 18,
          width: '100%'
        }
      },
      $('div',
        {
          style: {
            transform: 'translateX(calc(2 * var(--indentation-size)))'
          }
        },
        props.name,
        (props.vars || []).map(e =>
          $(Var, e)
        ),
        (props.scopes || []).map(e =>
          $(El, Object.assign({depth: props.depth + 1}, e))
        )
      )
    );
  };
};
