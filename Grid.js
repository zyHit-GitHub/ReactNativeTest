import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    ColorPropType,
} from 'react-native';
import PropTypes from 'prop-types';

class Grid extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            width: props.width || Dimensions.get('window').width,
        };
    }

    render() {
        const {
            cols,
            children,
            columnGap,
            rowGap,
            lineWidth,
            lineColor,
            style: styleProp,
        } = this.props;

        const rows = [];
        const itemWidth = Math.round((this.state.width - (cols - 1) * (columnGap || 0)) / cols);
        React.Children.forEach(children, (child, index) => {
            const rowIndex = Math.floor(index / cols);
            if (rows[rowIndex]) {
                rows[rowIndex].push(child);
            } else {
                rows[rowIndex] = [child];
            }
        });
        if (rows.length) {
            let lastRow = rows[rows.length - 1];
            lastRow.push.apply(lastRow, new Array(cols - lastRow.length).fill(false));
        }

        return (
            <View style={styleProp}>
                {rows.map((row, i) => {
                    return (
                        <View
                            key={i}
                            style={[
                                styles.rowWrapper,
                                rowGap && {marginBottom: rowGap},
                                i === rows.length - 1 && styles.noMarginBottom,
                                lineWidth && i !== 0 && {borderTopWidth: lineWidth, borderTopColor: lineColor},
                            ]}
                            onLayout={e => this.setState({ width: e.nativeEvent.layout.width })}
                        >
                            {row.map((item, j) => {
                                return (
                                    <View
                                        key={j}
                                        style={[
                                            {width: itemWidth},
                                            lineWidth && j !== 0 && {borderLeftWidth: lineWidth, borderLeftColor: lineColor},
                                        ]}
                                    >
                                        {item}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    }
}

Grid.propTypes = {
    /**
     * 尽量设置准确的宽度，否则布局容易闪烁，默认为屏幕宽度
     */
    width: PropTypes.number,
    /**
     * 网格列数，默认为 3
     */
    cols: PropTypes.number,
    /**
     * 网格水平方向间距
     */
    columnGap: PropTypes.number,
    /**
     * 网格垂直方向间距
     */
    rowGap: PropTypes.number,
    /**
     * 网格线粗细
     */
    lineWidth: PropTypes.number,
    /**
     * 网格线颜色
     */
    lineColor: ColorPropType,
    /**
     * 网格视图样式
     */
    style: View.propTypes.style,
};

Grid.defaultProps = {
    cols: 3,
    lineWidth: 0,
};

const styles = StyleSheet.create({
    rowWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    noMarginBottom: {
        marginBottom: 0,
    },
});

export default Grid;