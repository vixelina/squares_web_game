export const mouse = {
    x: 0,
    y: 0
};

export const squares = [];

export function updateSquarePosition(index, x, y) {
    if (squares[index]) {
        squares[index].x = x;
        squares[index].y = y;
    }
}

export function getSquare() {
    return squares;
}