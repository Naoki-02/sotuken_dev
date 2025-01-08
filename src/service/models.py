from django.contrib.auth.models import User
from django.core import validators
from django.db import models


# Create your models here.
class Ingredients(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ingredients') # ユーザーとのリレーション
    name = models.CharField(
        verbose_name='材料名', # 管理画面での表示名
        blank=False, # 必須項目
        null=False, # 必須項目
        max_length=20, # 最大文字数
        default='材料名', # デフォルト値
        validators=[
            validators.RegexValidator(
                regex=u'^[ぁ-んァ-ヶー一-龠]+$', # 正規表現のみ許可
                message='全角のひらがな・カタカナ・漢字で入力してください', # エラーメッセージ
                ),
            validators.MinLengthValidator(1), # 最小文字数
            validators.MaxLengthValidator(20)] # 最大文字数
    )
    quantity = models.CharField(
        verbose_name='数量', # 管理画面での表示名
        blank=False, # 必須項目
        null=True, # 必須項目
        max_length=10, # 最大文字数
        default='1個', # デフォルト値
        validators=[
            validators.RegexValidator(
                regex=u'^[0-9]+(個|kg|g|ml|L)?$', # 正規表現のみ許可
                message='半角数字と単位（個, kg, g, ml, L）で入力してください', # エラーメッセージ
                ),
            validators.MinLengthValidator(1), # 最小文字数
            validators.MaxLengthValidator(10)] # 最大文字数
    )
    category = models.CharField(
        verbose_name='カテゴリ', # 管理画面での表示名
        blank=False, # 必須項目
        null=True, # 必須項目
        max_length=10, # 最大文字数
        default='other', # デフォルト値
        validators=[
            validators.RegexValidator(
                regex=u'^[a-zA-Z]+$', # Only allow English letters
                message='Please enter in English letters only', # Error message
                ),
            validators.MinLengthValidator(1), # Minimum length
            validators.MaxLengthValidator(10)] # Maximum length
        )
    created_at = models.DateTimeField(auto_now_add=True) # 作成日時自動登録
    updated_at = models.DateTimeField(auto_now=True) # 更新日時自動登録

    def __str__(self):
        return self.name
    
class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")  # ユーザーと紐付け
    name = models.CharField(max_length=255)  # 料理名
    description = models.TextField(blank=True, null=True)  # 簡単な説明
    cooking_time = models.CharField(max_length=50, blank=True, null=True)  # 調理時間
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', '簡単'),
            ('medium', '普通'),
            ('hard', '難しい')
        ],
        blank=True,
        null=True
    )  # 難易度
    created_at = models.DateTimeField(auto_now_add=True)  # 作成日時
    updated_at = models.DateTimeField(auto_now=True)  # 更新日時

    def __str__(self):
        return self.name

# 提案材料モデル
class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")  # 料理と紐付け
    name = models.CharField(max_length=255)  # 材料名

    def __str__(self):
        return self.name
    
class Instruction(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="instructions")
    step_number = models.PositiveIntegerField()
    description = models.TextField()

    class Meta:
        ordering = ['step_number']

    def __str__(self):
        return f"Step {self.step_number} for {self.recipe.name}"
    
class CookHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cook_histories")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="cook_histories")
    cooked_at = models.DateTimeField(auto_now_add=True)  # 調理した日時
    rating = models.PositiveIntegerField(blank=True, null=True)  # 任意の評価（1〜5など）
    notes = models.TextField(blank=True, null=True)  # 調理後のメモ（例: 追加した材料など）

    def __str__(self):
        return f"{self.user.username} cooked {self.recipe.name} on {self.cooked_at}"
    
# Dish (料理) モデル
class Dish(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dishes')  # ユーザーとの関連
    name = models.CharField(max_length=255)  # 料理名
    description = models.TextField(blank=True, null=True)  # 料理の簡単な説明
    cooking_time = models.CharField(max_length=50, blank=True, null=True)  # 調理時間
    meal_type = models.CharField(max_length=10, choices=[
        ('main', '主菜'),
        ('side', '副菜'),
        ('soup', '汁物')
    ])
    def __str__(self):
        return f"{self.name} ({self.get_meal_type_display()})"


# 1日の食事（朝食、昼食、夕食）
class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')  # ユーザーとの関連
    meal_time = models.CharField(max_length=10, choices=[
        ('breakfast', '朝食'),
        ('lunch', '昼食'),
        ('dinner', '夕食')
    ])  # 食事の時間（朝食、昼食、夕食）
    dishes = models.ManyToManyField(Dish) # その食事に含まれる料理

    def __str__(self):
        return f"{self.get_meal_time_display()} - {self.user.username}" 
    
class DishIngredient(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name="ingredients")  # 料理と紐付け
    name = models.CharField(max_length=255)  # 材料名

    def __str__(self):
        return self.name
    
class DishInstruction(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name="instructions")
    step_number = models.PositiveIntegerField()
    description = models.TextField()

    class Meta:
        ordering = ['step_number']

    def __str__(self):
        return f"Step {self.step_number} for {self.recipe.name}"