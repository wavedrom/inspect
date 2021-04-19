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
          className: 'spacer',
          xmlns: 'http://www.w3.org/2000/svg',
          width: 18, height: 18, viewBox: '0 0 18 18'
        },
        $('path', {d})
      ),
      $('span', {className}, label),
      $('span', {}, ': ')
    );

  return function Type (props) {
    const kind = props.type + (props.dir ? ('_' + props.dir) : '');
    const type = ({
      module: spacer('M10 17l5-5-5-5v10z', 'module', 'M'),
      task: spacer('M10 17l5-5-5-5v10z', 'task', 'T'),

      wire: spacer(null, 'wire', 'W'),
      wire_input: spacer('M6 10h4v-4l6 6l-6 6v-4h-4z', 'wire', 'W'),
      wire_output: spacer('M16 10h-6v-4l-6 6l6 6v-4h6z', 'wire', 'W'),

      reg: spacer(null, 'reg', 'R'),
      reg_input: spacer('M6 10h4v-4l6 6l-6 6v-4h-4z', 'reg', 'R'),
      reg_output: spacer('M16 10h-6v-4l-6 6l6 6v-4h6z', 'reg', 'R'),

      logic: spacer(null, 'logic', 'L'),
      logic_input: spacer('M6 10h4v-4l6 6l-6 6v-4h-4z', 'logic', 'L'),
      logic_output: spacer('M16 10h-6v-4l-6 6l6 6v-4h6z', 'logic', 'L'),

      integer: spacer(null, 'integer', 'i'),

      int: spacer(null, 'int', 'I'),
      int_input: spacer('M6 10h4v-4l6 6l-6 6v-4h-4z', 'int', 'I'),
      int_output: spacer('M16 10h-6v-4l-6 6l6 6v-4h6z', 'int', 'I'),

      bit: spacer(null, 'bit', 'b'),
      bit_input: spacer('M6 10h4v-4l6 6l-6 6v-4h-4z', 'bit', 'b'),
      bit_output: spacer('M16 10h-6v-4l-6 6l6 6v-4h6z', 'bit', 'b'),

      string: spacer(null, 'string', 's'),
      string_input: spacer('M6 10h4v-4l6 6l-6 6v-4h-4z', 'string', 's'),
      string_output: spacer('M16 10h-6v-4l-6 6l6 6v-4h6z', 'string', 's'),

      hier: spacer(null, '---', 'H')
    })[kind] || spacer(null, 't', 't');
    return type;
  };
};

// input: 'M6 8h4v-4l6 6l-6 6v-4h-4z'
// output: 'M16 8h-6v-4l-6 6l6 6v-4h6z'
// inout: M8 8h4v-4l6 6l-6 6v-4h-4v4l-6-6l6-6z

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
        $('span', {className: props.type}, props.name),
        props.mname ? $('span', {className: 'comment'}, ' -> ', props.mname) : null
      )
    );
  };
};

module.exports = React => {
  const $ = React.createElement;
  const Line = reLine(React);
  return function List (props) {
    const res = reductor()(props);
    return $('div', {className: 'wavedrom-inspect'}, res.map(Line));
  };
};
