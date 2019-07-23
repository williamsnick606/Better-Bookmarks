# Author: Joseph Rodrigues
# Date: 07/07/19
# 
# Name
#   -dmoz_categories.py
# 
# Description
#   -Prints categories and number of categories in dmoz.csv.

import pandas as pd

dmoz = pd.read_csv('dmoz.csv')
list = []
list.append(dmoz.iloc[0][1])
for i in range(len(dmoz)):
   category = dmoz.iloc[i][1]
   if(category != list[-1]):
      list.append(category)

print(list)
print(len(list))
