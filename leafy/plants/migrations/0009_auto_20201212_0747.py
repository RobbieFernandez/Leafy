# Generated by Django 3.1.1 on 2020-12-12 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0008_auto_20201212_0747'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plant',
            name='danger_threshold',
            field=models.PositiveIntegerField(help_text='Plant will be shown in the "Water Now" section of the dashboard after this many days since the last watering'),
        ),
    ]
