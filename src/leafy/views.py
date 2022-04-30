from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView

from .forms import LeafyUserCreationForm, LeafyLoginForm

def signup(request):
    from django.urls import reverse
    if request.method == 'POST':
        form = LeafyUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('plant-dashbaord')
    else:
        form = LeafyUserCreationForm()

    return render(
        request,
        'user_form.html',
        {
            'form': form,
            "title": "Leafy - Sign Up",
            "submit_label": "Sign Up",
            "form_title": """
                <h1 class="title has-text-centered">Sign Up</h1>
                <div class="content has-text-centered">
                    <p>Already have an account? <a href="/">Log In</a></p>
                </div>
            """,
        }
    )


class LeafyLoginView(LoginView):
    form_class = LeafyLoginForm

    def __init__(self, *args, **kwargs):
        from django.urls import reverse
        self.template_name = "user_form.html"
        self.extra_context = {
            "title": "Leafy - Log In",
            "submit_label": "Log In",
            "form_title": f"""
                <h1 class="title has-text-centered">Log In</h1>
                <div class="content has-text-centered">
                    <p>Don't have an account? <a href="{reverse("signup")}">Sign Up</a></p>
                </div>
            """
        }
        return super().__init__(*args, **kwargs)
