from open_facebook.api import OpenFacebook, FacebookAuthorization


class MockFacebookAPI(OpenFacebook):
    mock = True

    def me(self):
        from django_facebook.tests_utils.sample_data.user_data import user_data
        data = user_data[self.access_token]
        return data

    def my_image_url(self, size=None):
        from django_facebook.tests_utils.sample_data.user_data import user_data
        data = user_data[self.access_token]
        image_url = data['image']
        return image_url

    def is_authenticated(self, *args, **kwargs):
        from django_facebook.tests_utils.sample_data.user_data import user_data
        return self.access_token in user_data

    def get(self, path, **kwargs):
        if 'likes' in path:
            like = dict(name="Vogue Nederland", category="Media/news/publishing", id="136067283169158")
            response = dict(data=[like])
            return response
        if 'friends' or 'friend' in path:
            friend = dict(name="Aida Tavakkolie", id="172001264")
            response = dict(data=[friend])
            return response

    def set(self, path, **kwargs):
        return dict(id=123456789)

    def fql(self, query, **kwargs):
        """Runs the specified query against the Facebook FQL API.
        """
        friend = dict(name="Aida Tavakkolie", uid=172001264, gender='F')
        response = [friend]

        return response


class MockFacebookAuthorization(FacebookAuthorization):
    @classmethod
    def extend_access_token(cls, access_token):
        '''
        https://developers.facebook.com/roadmap/offline-access-removal/
        We can extend the token only once per day
        Normal short lived tokens last 1-2 hours
        Long lived tokens (given by extending) last 60 days
        '''
        response = dict(access_token=access_token, expires='123456789')
        return response
