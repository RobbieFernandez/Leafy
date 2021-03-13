from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .fields import add_icon_to_field


class LeafyUserCreationForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        add_icon_to_field(self.fields['username'], "fas fa-user")
        add_icon_to_field(self.fields['password1'], "fas fa-lock")
        add_icon_to_field(self.fields['password2'], "fas fa-lock")


class LeafyLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        add_icon_to_field(self.fields['username'], "fas fa-user")
        add_icon_to_field(self.fields['password'], "fas fa-lock")
