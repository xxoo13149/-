import { LevelData } from './types';

export const LEVELS: LevelData[] = [
  {
    id: 2300112,
    title: "第一关：出租车计费",
    description: "根据里程计算出租车费用。计费标准：3公里内8元，3-6公里1.5元/公里，超过6公里2.25元/公里。",
    codeSnippet: `s=float(___1___("行驶公里数："))   ## 输入公里数
if s ___2___:                  ## 3公里内的部分 收费8元
   p = 8
elif s ___3___:                ## 超过3公里但未超过6公里
   p = 1.5 *(s-3)+ ___4___    ## 超过3公里且未超过6公里的部分
else ___5___                   ## 超过6公里部分
   p = ___6___  + 1.5*3 + 8    ## 计算总费用
print("行驶里程：{1}公里，应付车费:{___7___}元".format(p,s))`,
    blanks: [
      { id: 1, answers: ["input"] },
      { id: 2, answers: ["<=3", "<= 3"] },
      { id: 3, answers: ["<=6", "<= 6"] },
      { id: 4, answers: ["8"] },
      { id: 5, answers: [":"] },
      { id: 6, answers: ["2.25*(s-6)", "2.25 * (s - 6)", "2.25 * (s-6)", "2.25*(s - 6)"] },
      { id: 7, answers: ["0:.1f"] },
    ],
    help: {
      analysis: "本题考察条件分支与输入输出。\n1. 获取输入使用 `input()` 函数，注意题目要求转换为 float。\n2. 条件判断使用 `if...elif...else` 结构，注意冒号 `:`。\n3. 格式化输出字符串时，`{0:.1f}` 表示保留1位小数，题目中使用 `format` 函数，对应位置参数。",
      keywords: ["input", "elif", "format", ":.1f"]
    }
  },
  {
    id: 2300132,
    title: "第二关：奇偶数逻辑大挑战",
    description: "输入一个100以内的数。若是奇数，计算能被3整除数的积；若是偶数，计算累加和。",
    codeSnippet: `a = ___1___(input("输入一个100以内的正整数:"))
b = ___2___                         ## 获得从1到a（包括1和a）的一个整数序列数
if ___3___:                           ## 判断a是否为偶数
    print("输入的为偶数")
    ___4___                ## 设置求和的初始值
    for i in b:
        sum ___5___         ## 求1到该偶数的总和
    print("从1到该数之间的所有整数的和：", sum)
else:
    print("输入的为奇数")
    pr = ___6___            ## 设置初始值
    for j in b:
        if ___7___:    ## 寻找1到a之间的能被3整除的数
            pr *= j
    print("从1到该数之间能被3整除的数的积：", pr)`,
    blanks: [
      { id: 1, answers: ["int"] },
      { id: 2, answers: ["range(1, a+1)", "range(1,a+1)", "range(1, a + 1)"] },
      { id: 3, answers: ["a % 2 == 0", "a%2==0", "a%2 == 0", "a % 2==0"] },
      { id: 4, answers: ["sum = 0", "sum=0"] },
      { id: 5, answers: ["+= i", "+=i", "= sum + i", "=sum+i"] },
      { id: 6, answers: ["1"] },
      { id: 7, answers: ["j % 3 == 0", "j%3==0", "j % 3==0", "j%3 == 0"] },
    ],
    help: {
      analysis: "本题考察循环与取余运算。\n1. `range(start, stop)` 是左闭右开区间，要包含 `a` 必须写 `a+1`。\n2. 判断偶数使用取余运算符 `%`，`a % 2 == 0`。\n3. 累加求和初始值为 0，累乘求积初始值必须为 1。",
      keywords: ["range", "% (取余)", "+= (累加)", "int"]
    }
  },
  {
    id: 2300135,
    title: "第三关：增长率计算器",
    description: "计算增长率。小心！必须处理“除数为零”的异常情况，防止程序崩溃。",
    codeSnippet: `while ___1___:
    try:
        last, current = input("请输入上期和当前的值：").___2___(",")
        last = float(last); current = float(current)
        growth_rate = ((current - last) / last) * 100
        print("增长率为：{:___3___}%".format(growth_rate))
        ___4___                     ## 退出输入状态
    ___5___ ZeroDivisionError:      ## 抛出上期数值不能为0的异常
        print("上期数值不能为0")`,
    blanks: [
      { id: 1, answers: ["True"] },
      { id: 2, answers: ["split"] },
      { id: 3, answers: [".2f"] },
      { id: 4, answers: ["break"] },
      { id: 5, answers: ["except"] },
    ],
    help: {
      analysis: "本题考察异常处理与字符串操作。\n1. 无限循环通常使用 `while True`，在满足条件后用 `break` 退出。\n2. `split(',')` 用于按逗号分割字符串。\n3. 异常捕获结构为 `try...except ErrorType`，用于处理除零错误。",
      keywords: ["try-except", "split", "break", ".2f"]
    }
  },
  {
    id: 2300131,
    title: "第四关：列表数据守门员",
    description: "输入5个整数。你的任务是验证输入数量是否正好为5个，并拦截任何字母输入。",
    codeSnippet: `while ___1___:   ## 循环输入
    n_list = input("请输入5个正整数（英文逗号分隔）:").___2___(",")
    if ___3___(n_list) != 5:           ## 如果整数的数量不是5个
        print("请重新输入正确数量的正整数！")
    else:
        for e in n_list:
            if e.___4___():  ## 判断是否含有字母
                print("含有字母！请重新输入！")
                break          
        else:        
            print(n_list)
            ___5___   ## 退出输入状态`,
    blanks: [
      { id: 1, answers: ["True"] },
      { id: 2, answers: ["split"] },
      { id: 3, answers: ["len"] },
      { id: 4, answers: ["isalpha"] },
      { id: 5, answers: ["break"] },
    ],
    help: {
      analysis: "本题考察列表验证。\n1. `len()` 函数获取列表长度。\n2. `isalpha()` 字符串方法判断是否全为字母。\n3. `for...else` 结构：当 for 循环正常结束（未被 break 打断）时，执行 else 块。",
      keywords: ["len", "isalpha", "for-else", "split"]
    }
  },
  {
    id: 2300129,
    title: "第五关：终极成绩管理系统",
    description: "生成随机学生成绩，并使用字典和内置函数计算全班平均分。这是最后的考验！",
    codeSnippet: `import ___1___  ## 导入合适的模块
def generate_student_data(number_of_students):
    # 生成指定数量的学生数据
    student_data = {} 
    for i in range(number_of_students):
        student_name = "Student" + str(i + 1)
        student_grade = random.___2___(60, 100)
        student_data[student_name] = ___3___
    return student_data

def calculate_average_grade(student_data):
    # 计算学生成绩的平均值
    grades = student_data.___4___()
    average_grade = sum(grades) / ___5___(grades)
    return average_grade

# 主程序逻辑 omitted for brevity
students_data = generate_student_data(10)
average = calculate_average_grade(students_data)`,
    blanks: [
      { id: 1, answers: ["random"] },
      { id: 2, answers: ["randint"] },
      { id: 3, answers: ["student_grade"] },
      { id: 4, answers: ["values"] },
      { id: 5, answers: ["len"] },
    ],
    help: {
      analysis: "本题考察字典操作与随机数。\n1. `import random` 导入模块。\n2. `random.randint(a, b)` 生成 [a, b] 范围内的整数。\n3. 字典取所有值使用 `.values()` 方法。\n4. 计算平均数 = 总和 `sum()` / 个数 `len()`。",
      keywords: ["random", "randint", "values", "dict"]
    }
  }
];