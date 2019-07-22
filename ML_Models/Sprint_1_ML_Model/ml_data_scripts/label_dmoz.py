# Author: Joseph Rodrigues
# Date: 07/07/19
# 
# Name
#   -label_dmoz.py
# 
# Description
#   -Adds a column to the original dmoz.csv called 'labels' which
#    contains the value of the numerical category for the respective
#    row of data.

import pandas as pd

dmoz = pd.read_csv('dmoz.csv')
list = []
labels = {'Arts': 0, 'Business': 1, 'Computers': 2, 'Games': 3,
          'Health': 4, 'Home': 5, 'News': 6, 'Recreation': 7,
          'Reference': 8, 'Science': 9, 'Shopping': 10, 'Society': 11,
          'Sports': 12}

for i in range(len(dmoz)):
   list.append(labels[dmoz.iloc[i][1]])

list = pd.Series(list)
dmoz = dmoz.assign(label=list.values)

dmoz.to_csv('dmoz.csv')
