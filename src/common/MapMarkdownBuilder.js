//data struct:
// {
//     t: {
//         name: '',
//         code: ''
//     },
//     children: []
// }
let render_prefix = ['city', 'county', 'town'];
function generator(data, level) {
    let res;
    if ( level == 0 ) {
        res = '# ' + data.t.name + '\n';
    } else {
        res = Array(level * 2).join(' ') + "- " + '[' + data.t.name + ']' + '(#' + render_prefix[level-1] + data.t.code +')' + '\n';
    }
    // 如果children不为空，那么分别处理子节点，否则返回
    if (data.children != undefined || data.children != null) {
        data.children.forEach(function(child) {
            res += generator(child, level + 1)
        })
    }
    return res;
}
const MapMarkdownBuilder = function (data) {
    return generator(data, 0);
};

export default MapMarkdownBuilder;
