import math

class Circle:
      def __init__(self, r):
         self.r = r

      def area(self):
         return math.pi * self.r ** 2

def describe(shape):
      if hasattr(shape, 'area'):
         print(f"Area: {shape.area():.2f}")
      else:
         print("Not a valid shape.")

# 🎯 Run demo
c = Circle(3)
describe(c)