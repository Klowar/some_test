/*

Тестовое задание:
Нужно создать двумерный массив 10х10 с случайными числами в интервале [-100..100]
Вывести этот массив в консоль в читаемом виде
В выведенном массиве:
- Пометить строку с минимальным числом - звездочкой
- В каждой строке вывести наименьшее положительное число
- В каждой строке написать какое минимальное кол-во чисел необходимо заменить чтобы не встречалось 3 положительных или отрицательных числа подряд.

Помимо правильности решения будет учитываться человекочитаемость и понятность выведенных данных. Обратите внимание на пограничные случаи.
Платформа выполнения NodeJS. Не допускается использование сторонних библиотек.

*/
const SPACE = " ";
const SNAKE = "_";
const MACRON = "—";
const NEW_LINE = "\n";
const POSITIVE_COL = "  Min (positive)";
const SWAP_COL = "  Swaps For No Sames";

export const print_matrix = (matrix: number[][]) => {
    const to_lng = (v: string) => v.length;
    const to_str = (arr: Array<any>) => arr.map(String);
    const strings = matrix.map(to_str);
    const lengths = strings.flat().map(to_lng);
    const maxLength = Math.max(...lengths);
    //
    const padder = (max: number, rep: string) => (str: String) =>
        str.padStart(max, rep);
    const pad = padder(maxLength, SPACE);
    const padded = strings.map((arr) => arr.map(pad));
    // constants
    //
    const padMacron = padder(maxLength, MACRON);
    const padSnake = padder(maxLength, SNAKE);
    const minNumber = Math.min(...matrix.flat());
    const body = matrix
        .map((e, i) => {
            const nums = matrix[i];
            const strs = padded[i];
            // checks for smallest, swaps, min positive
            const positiveNumbers = nums.filter(isPositive);
            const minPositive = Math.min(...positiveNumbers);
            const swaps = swapsToBreakAllStreaks(nums, 3);
            // build out
            const prefix = nums.includes(minNumber) ? "* |" : "  |";
            const posCol = `| ${minPositive}`.padEnd(
                POSITIVE_COL.length,
                SPACE
            );
            const swapCol = `  ${swaps}`.padEnd(SWAP_COL.length, SPACE);
            const postfix = posCol + swapCol;
            const body = strs.join(SPACE);
            const out = prefix + body + postfix;
            return out;
        })
        .join(NEW_LINE);
    const header =
        "   " +
        Array(matrix.length).fill(SNAKE).map(padSnake).join(SNAKE) +
        POSITIVE_COL +
        SWAP_COL;
    const footer =
        "   " + Array(matrix.length).fill(MACRON).map(padMacron).join(MACRON);
    // print
    console.log(header);
    console.log(body);
    console.log(footer);
};

const create_matrix = (
    width: number,
    height: number,
    filler: Generator<number>
) => {
    return Array(width)
        .fill(0)
        .map(() =>
            Array(height)
                .fill(0)
                .map(() => filler.next().value)
        );
};

const create_square = (edge: number, filler: Generator<number>) =>
    create_matrix(edge, edge, filler);

// -- generators --

function* random(min: number, max: number) {
    while (1) yield Math.round(Math.random() * min + Math.random() * max);
}

// -- utils --

const isPositive = (n: number) => n > 0;

const swapsToBreakAllStreaks = (arr: number[], maxStreak = 3) => {
    let res = 0;
    let lastStreak = 1;
    for (let i = 0; i + 1 < arr.length; i++) {
        if (Math.sign(arr[i]) == Math.sign(arr[i + 1])) lastStreak++;
        else {
            res += Math.floor(lastStreak / maxStreak);
            lastStreak = 1;
        }
    }
    return res;
};

if (!module.parent) void print_matrix(create_square(10, random(-100, 100)));
