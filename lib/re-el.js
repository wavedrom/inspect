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

const reType = $ => {

  const spacer = (d, className, label) =>
    $('span', {},
      $('svg',
        {
          class: 'spacer',
          xmlns: 'http://www.w3.org/2000/svg',
          width: 18, height: 18, viewBox: '0 0 18 18'
        },
        $('path', {d})
      ),
      $('span', {class: className}, label),
      $('span', {}, ': ')
    );

  return function Type (props) {
    const type = ({
      module: spacer('M10 17l5-5-5-5v10z', 'module', 'M'),
      task: spacer('M10 17l5-5-5-5v10z', 'task', 'T'),
      wire: spacer('', 'wire', 'W'),
      reg: spacer('', 'reg', 'R')
    })[props.type];
    return type;
  };
};

const reLine = React => {
  const $ = React.createElement;
  const Type = reType($);
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
            transform: 'translateX(' + (18 * props.depth) + 'px)'
          }
        },
        $(Type, props),
        $('span', {}, props.name),
        $('span', {class: 'comment'}, ' -> ', props.mname)
      )
    );
  };
};

module.exports = React => {
  const $ = React.createElement;
  const Line = reLine(React);
  return function List (props) {
    const res = reductor()(props);
    return $('div', {class: 'wavedrom-inspect'}, res.map(Line));
  };
};
