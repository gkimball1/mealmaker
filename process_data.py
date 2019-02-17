import pandas as pd, numpy as np

nutrients = pd.read_csv('data/nutrients.csv').as_matrix()
products = pd.read_csv('data/products.csv').as_matrix()
with open('data/data.txt', '+w', encoding='utf8') as file:
    f = lambda i: (nutrients[i][1] >= 203 and nutrients[i][1] <= 205) or nutrients[i][1] == 208
    selected = [i for i in range(len(nutrients)) if f(i)]
    for i in range(len(products)):
        indices = [j for j in selected if products[i][0] == nutrients[j][0]]
        if len(indices) == 4:
            info = ''
            for index in indices:
                info += '::' + str(nutrients[index][4])
            file.write(products[i][1] + info + '\n')
        if (i+1)%10 == 0:
            print(str(i+1) + ' / ' + str(len(products)))
