import copy

class Base:
    def __init__(self):
        self.dicts = []
    def __copy__(self):
        print("Copying...")
        # Old way that fails in 3.14
        try:
            duplicate = copy.copy(super())
            duplicate.dicts = self.dicts[:]
            print("Old way success")
            return duplicate
        except Exception as e:
            print(f"Old way failed: {e}")
        
        # New way
        duplicate = self.__class__.__new__(self.__class__)
        duplicate.dicts = self.dicts[:]
        print("New way success")
        return duplicate

b = Base()
b2 = copy.copy(b)
print(f"Original: {b.dicts}, Copy: {b2.dicts}")
