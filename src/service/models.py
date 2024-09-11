from django.core import validators
from django.db import models


# Create your models here.
class Ingredients(models.Model):
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
    quantity = models.PositiveSmallIntegerField(
        verbose_name='数量', # 管理画面での表示名
        blank=False, # 必須項目
        null=False, # 必須項目
        default=1, # デフォルト値
        validators=[
            validators.MinValueValidator(1), # 最小値
            validators.MaxValueValidator(50)] # 最大値
    )
    category = models.CharField(
        verbose_name='カテゴリ', # 管理画面での表示名
        blank=True, # 空欄可
        null=True, # 空欄可
        max_length=10, # 最大文字数
        validators=[
            validators.RegexValidator(
                regex=u'^[ぁ-んァ-ヶー一-龠]+$', # 正規表現のみ許可
                message='全角のひらがな・カタカナ・漢字で入力してください', # エラーメッセージ
                ),
            validators.MinLengthValidator(1), # 最小文字数
            validators.MaxLengthValidator(10)] # 最大文字数
        )
    created_at = models.DateTimeField(auto_now_add=True) # 作成日時自動登録
    updated_at = models.DateTimeField(auto_now=True) # 更新日時自動登録

    def __str__(self):
        return self.name