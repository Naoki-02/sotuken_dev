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