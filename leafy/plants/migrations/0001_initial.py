# Generated by Django 3.1.1 on 2021-03-13 06:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Plant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=512)),
                ('warning_threshold', models.PositiveIntegerField(help_text='Plant will be shown in the "Water Soon" section of the dashboard after this many days since the last watering')),
                ('danger_threshold', models.PositiveIntegerField(help_text='Plant will be shown in the "Water Now" section of the dashboard after this many days since the last watering')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WateredEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('watered_on', models.DateTimeField()),
                ('plant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='plants.plant')),
                ('watered_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
