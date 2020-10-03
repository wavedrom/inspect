'use strict';

const reductor = () => {
  const res = [];
  let depth = 0;
  let idx = 0;
  return function rec (props) {
    res.push(Object.assign({depth, idx, key: idx}, props));
    depth++;
    idx++;
    (props.scopes || []).map(rec);
    (props.vars || []).map(rec);
    depth--;
    return res;
  };
};

const reType = React => {
  const $ = React.createElement;
  return function Type (props) {
    const type = ({
      module: ' M ',
      task: ' T ',
      wire: ' W ',
      reg: ' R '
    })[props.type];
    return $('span', {}, type);
  };
};

const reLine = React => {
  const $ = React.createElement;
  const Type = reType(React);
  return function Line (props) {
    return $('div',
      {
        style: {
          position: 'absolute',
          left: 0,
          top: 18 * props.idx,
          height: 18,
          width: '100%'
        }
      },
      $('div',
        {
          style: {
            transform: 'translateX(calc(' + props.depth + ' * var(--indentation-size)))'
          }
        },
        $(Type, props),
        props.name
      )
    );
  };
};

module.exports = React => {
  const $ = React.createElement;
  const Line = reLine(React);
  return function List (props) {
    const res = reductor()(props);
    return $('div', {}, res.map(Line));
  };
};
